import { useState } from "react";
import Upload from "../components/Upload";
import YourFiles from "../components/YourFiles";
import Sidebar from "../components/Sidebar";
import useToggleSideBar from "../stores/useToggleSidebar";
import DashboardNav from "../components/DashboardNav";

const ProcessFile = () => {
    const [ uploadDone, setUploadDone ] = useState(false);
    const isToggled = useToggleSideBar(state => state.isToggled)

    return (
        <>
            
            <div className="min-h-screen flex">
                <DashboardNav/>
                <main className="flex-1 p-4 md:p-6 lg:p-8 mt-[3em]">
                    <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
                        <div className="w-full xl:w-1/2">
                            <Upload setUploadDone={setUploadDone} />
                        </div>
                        <div className="w-full xl:w-1/2">
                            <YourFiles uploadDone={uploadDone} />
                        </div>
                    </div>
                    </div>
                </main>
                {isToggled && <Sidebar/>}
            </div>
        </>
    );
};

export default ProcessFile;
