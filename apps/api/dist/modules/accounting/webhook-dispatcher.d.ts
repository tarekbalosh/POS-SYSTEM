export declare class WebhookDispatcher {
    dispatch(payload: any, config: {
        endpointUrl: string;
        secret: string;
    }): Promise<{
        success: boolean;
    }>;
    private generateSignature;
}
