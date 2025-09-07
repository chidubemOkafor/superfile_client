export const getStatusColor = (status: any) => {
    switch (status?.toLowerCase()) {
        case 'completed':
        case 'finished':
        case 'success':
            return 'bg-green-100 text-green-800'
        case 'pending':
        case 'uploading':
            return 'bg-yellow-100 text-yellow-800'
        case 'error':
        case 'failed':
            return 'bg-red-100 text-red-800'
        case 'processing':
            return 'bg-blue-100 text-blue-800'
        default:
            return 'bg-gray-100 text-gray-800'
    }
}