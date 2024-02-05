import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function LoadingCircle() {
    return <div className="w-full flex justify-center">
        <AiOutlineLoading3Quarters className='animate-spin text-blue-600' />
    </div>
}