export const logInfo = (
    message: string,
    messageType: 'Info' | 'Warning' | 'Error',
    priority: 'Critical' | 'High' | 'Medium' | 'Low',
    project: string,
    className: string,
    method: string
) => {
    console.log(`[${new Date().toISOString()}] [${priority}] [${messageType}] [${project}] [${className}] [${method}] ${message}`);
};

export const logError = logInfo;
