import { RiArchiveDrawerLine } from "react-icons/ri";
import useToggleSideBar from "../stores/useToggleSidebar";
import { Link } from "react-router-dom";
import useHandleTheme from "../hooks/useHandleTheme";

const DashboardNav = () => {
  const { setIsToggled } = useToggleSideBar()
  const {theme} = useHandleTheme()

  return (
    <nav className="flex-1 p-4 md:p-6 lg:p-8 justify-center  mt-5">
      <div className=" flex justify-between items-center">
        {/* <h1 className="font-bold text-2xl">DASHBOARD</h1> */}
        {""}
        <div className="space-x-5 flex">
          <div className={`${theme === "dark" ? "bg-gradient-to-br from-gray-700 to gray-100 text-white hover:bg-red-800 hover:text-red-100" : "border border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"} p-2 px-3 rounded-md  items-center flex cursor-pointer `}>logout</div>
          <div className={`${theme === "dark" ? "bg-gradient-to-br from-gray-700 to gray-100 text-white hover:bg-blue-800 hover:text-red-100" : "border border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"} p-2 px-3 rounded-md  items-center flex cursor-pointer `}
            onClick={setIsToggled}
          ><RiArchiveDrawerLine/></div>
        </div>
        <div className={`${theme === "dark" ? "bg-gradient-to-br from-gray-700 to gray-100 text-gray-400" : "border border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100"} p-2 px-3 rounded-md  items-center flex cursor-pointer `}>
          <Link to={'/'}>SUPERFILE</Link>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNav
