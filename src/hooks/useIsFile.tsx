import axios from "axios"
import { useState } from "react"

export const useIsFile = () => {
    const [exists, setExists] = useState(false)

    return {
        checkFile: async(fileId: string) => {
            try {
                const response = await axios.get(`http://localhost:5000/file/file_exists?fileId=${fileId}`)
                setExists(response.data.isFound);
                return response.data.isFound
            } catch (e) {
                console.error("error:", e)
            }
        },
        exists
    }
}