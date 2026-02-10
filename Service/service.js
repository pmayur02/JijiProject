const supabase = require("../SupabaseConnection/supabaseConnection")
const fs = require("fs/promises");
const path = require("path");

module.exports.register = async (payload) => {
    try {
        const { name, email, password } = payload;

        if (!name || !email || !password) return {
            statusCode: 400,
            message: "Enter valid Data",
            data: null
        }

        const { data: isUserExist, error: userCheckError } = await supabase.from("Profile").select("id").eq("email", email).single();
        if (isUserExist) {
            return {
                statusCode: 404,
                message: "User Already Exists",
                data: null
            }
        }

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });
        if (signUpError) {
            return {
                statusCode: signUpError.status,
                message: signUpError.message,
                data: null
            }
        }

        const { data: profileData, error: profileError } = await supabase.from("Profile").insert({ id: signUpData.user.id, name, email });
        if (profileError) {
            return {
                statusCode: profileError?.status,
                message: profileError?.message,
                data: null
            }
        }

        return {
            statusCode: profileData?.status || 200,
            message: 'User registered successfully',
            data: null
        }

    } catch (error) {
        return {
            statusCode: 500,
            message: "Internal server error",
            data: null
        };
    }
}

module.exports.login = async (payload) => {
    try {
        const { email, password } = payload;
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            return {
                statusCode: error?.status,
                message: error?.message,
                data: null
            }
        }

        return {
            statusCode: data.status || 200,
            message: data?.message || "Logged in successful",
            data: {
                token: data?.session?.access_token,
                user: data?.user
            }
        }

    } catch (error) {
        return {
            statusCode: 500,
            message: "Internal server error",
            data: null
        };
    }
}

module.exports.askJiJi = async (payload) => {
    try {

        const { question, user_id } = payload;

        if (!question) return {
            statusCode: 400,
            message: "Enter your question",
            data: null
        }

        // fetch model data
        const modelData = fetchAvailableData(question);
        if (!modelData || Object.keys(modelData).length === 0) return {
            statusCode: 400,
            message: "Enable to fetch Data.",
            data: null
        }


        // Insert query / question into Supabase
        const { data: queryData, error: queryError } = await supabase
            .from("queries")
            .insert({ user_id : user_id, question: modelData?.question, answer: modelData?.answer })
            .select()
            .single();

        if (queryError) {
            return {
                statusCode: queryError?.status,
                message: queryError?.message,
                data: null,
            };
        }

        // generate filePath and buffer to store in storage
        let { pptPath, videoPath, pptBuffer, videoBuffer } = await generateFilePathAndBuffer(queryData?.id);

        const uploadPromises = [
            supabase.storage.from('learning-content').upload(pptPath, pptBuffer, { contentType: 'application/vnd.openxmlformats-officedocumentpresentationml.presentation' }),

            supabase.storage.from('learning-content').upload(videoPath, videoBuffer, { contentType: 'video/mp4' })

        ]

        // upload files on storage
        const uploadResult = await Promise.allSettled(uploadPromises);
        const [pptResult, videoResult] = uploadResult;


        if ((pptResult.status === "fulfilled" && pptResult.value.data) && (videoResult.status === "fulfilled" && videoResult.value.data)) {
            pptPath = pptResult?.value?.data?.path;
            videoPath = videoResult?.value?.data?.path;
        } else {
            return {
                statusCode: 500,
                message: "something went wrong",
                data: uploadResult

            }
        }

        const insertResourcePromise = [
            supabase.from('resources').insert({ resource_type: 'ppt', storage_url: pptPath, query_id: queryData?.id, }),
            supabase.from('resources').insert({ resource_type: 'video', storage_url: videoPath, query_id: queryData?.id })
        ]

        // store files record in resouces table
        const insertResult = await Promise.allSettled(insertResourcePromise);
        const [pptInsert, videoInsert] = insertResult;

        if ((pptInsert.status === "fulfilled" && pptInsert.value.status == 201) && (videoInsert.status === "fulfilled" && videoInsert.value.status == 201)) {
            const { data: showData, error: ErrorData } = await supabase
                .from('queries')
                .select(`
                        id,
                        question,
                        answer,
                        created_at,
                        resources (
                        id,
                        resource_type,
                        storage_url,
                        created_at
                        )`)
                .eq('id', queryData?.id)
                .single()

            if (ErrorData) {

                return {
                    statusCode: ErrorData?.status,
                    message: ErrorData?.message,
                    data: null
                }
            }

            const videoResource = showData.resources.find(r => r.resource_type === 'video');
            const pptResource = showData.resources.find(r => r.resource_type === 'ppt');

            // return response
            return {
                statusCode: showData?.status ? showData?.status : 200,
                message: showData?.message ? showData?.message : "Data fetched successfully.",
                data: {
                    query: showData?.question,
                    answer: showData?.answer,
                    resources: {
                        video: videoResource?.storage_url,
                        ppt: pptResource?.storage_url
                    }

                }
            };

        } else {
            return {
                statusCode: 500,
                message: "something went wrong",
                data: insertResult

            }
        }

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            message: "Internal server error",
            data: null,
        };
    }
};



async function generateFilePathAndBuffer(queryId) {
    try {
        // Local file paths
        const fileFolderPath = path.join(__dirname, "../files");
        const videoFilePath = path.join(fileFolderPath, "test_small.mp4");
        const pptFilePath = path.join(fileFolderPath, "test_small.pptx");

        const videoFileName = path.basename(videoFilePath);
        const pptFileName = path.basename(pptFilePath);

        // Supabase Storage paths
        const basePath = `${queryId}/`; // query-specific folder
        const videoPath = `${basePath}${videoFileName}`;
        const pptPath = `${basePath}${pptFileName}`;

        // Read file buffers
        const videoBuffer = await fs.readFile(videoFilePath);
        const pptBuffer = await fs.readFile(pptFilePath);

        return {
            pptPath: pptPath,
            videoPath: videoPath,
            pptBuffer: pptBuffer,
            videoBuffer: videoBuffer
        }
    } catch (error) {
        throw new Error(error);
    }
}


function fetchAvailableData(prompt) {
    const modelData = [
        {
            question: "What is React.js?",
            answer: "React.js is a popular JavaScript library for building user interfaces, especially single-page applications, using a component-based approach."
        },
        {
            question: "What is a Large Language Model (LLM)?",
            answer: "A Large Language Model is an AI model trained on vast amounts of text data to understand, generate, and predict human-like language."
        },
        {
            question: "What is Node.js?",
            answer: "Node.js is a JavaScript runtime built on Chrome's V8 engine that allows developers to run JavaScript on the server side."
        },
        {
            question: "What is REST API?",
            answer: "A REST API (Representational State Transfer Application Programming Interface) is a set of rules that allows different software systems to communicate over HTTP."
        },
        {
            question: "What is Git?",
            answer: "Git is a distributed version control system used to track changes in source code during software development."
        }
    ];

    const result = modelData.filter((q) => q?.question.toLowerCase().includes(prompt.toLowerCase()))

    return result.length > 0 ? result[0] : null;

}

