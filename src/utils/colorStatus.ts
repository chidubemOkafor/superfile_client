export const getStatusColor = (status: any) => {
    switch (status?.toLowerCase()) {
        case 'completed':
        case 'finished':
        case 'success':
            return 'bg-green-500/30 text-green-500'
        case 'pending':
        case 'uploading':
            return 'bg-yellow-500/30 text-yellow-500'
        case 'error':
        case 'failed':
            return 'bg-red-500/30 text-red-500'
        case 'processing':
            return 'bg-blue-500/30 text-blue-500'
        default:
            return 'bg-gray-500/30 text-gray-500'
    }
}