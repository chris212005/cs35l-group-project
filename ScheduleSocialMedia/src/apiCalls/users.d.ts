declare module "../apiCalls/users" {
    type ApiResponse<T = any> = {
        message?: string;
        success: boolean;
        data?: T;
    };

    export function getLoggedUser(): Promise<ApiResponse>;
    export function getAllUsers(): Promise<ApiResponse>;
    export function updateProfile(payload: { profilePic?: string; bio?: string }): Promise<ApiResponse>;
}

export {};
