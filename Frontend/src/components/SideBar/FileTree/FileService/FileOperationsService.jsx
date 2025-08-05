import {GET_FILES, UPLOAD_FILES} from "../../../../helpers/url_helper";
import {APIClient} from "../../../../helpers/api_helper";

export class FileOperationsService {
    constructor() {
        this.api = new APIClient();
        this.activeOperations = new Map();
        this.abortControllers = new Map();
    }

    async uploadFile(file, parentId, onProgress) {
        const operationId = `upload-${Date.now()}-${file.name}`;

        try {
            const response = await this.api.uploadFile(
                UPLOAD_FILES,
                file,
                parentId,
                (progress) => onProgress?.(progress, operationId)
            );

            return {
                result: typeof response.data === 'string' ?
                    JSON.parse(response.data) : response.data,
                operationId
            };
        } catch (error) {
            // Error will be handled by axios interceptor
            throw error;
        }
    }

    async downloadFile(fileId, fileName, onProgress) {
        const operationId = `download-${Date.now()}-${fileName}`;

        try {
            await this.api.downloadFile(
                `${GET_FILES}/${fileId}`,
                fileName,
                (progress) => onProgress?.(progress, operationId)
            );

            return { success: true, operationId };
        } catch (error) {
            // Error will be handled by axios interceptor
            throw error;
        }
    }
}