import { RiArchiveDrawerLine } from "react-icons/ri";
import useToggleSideBar from "../stores/useToggleSidebar";
import { Link } from "react-router-dom";
import { useThemeStore } from "../stores/useThemeStore";

const DashboardNav = () => {
  const { setIsToggled } = useToggleSideBar()
  const {theme} = useThemeStore()

  return (
    <nav className="flex justify-center w-full mt-5 fixed">
      <div className="w-[75em] flex justify-between items-center">
        {/* <h1 className="font-bold text-2xl">DASHBOARD</h1> */}
        {""}
        <div className="space-x-5 flex">
          <div className="border border-gray-200 p-2 px-3 rounded-md bg-gray-50 items-center flex cursor-pointer hover:border-gray-300 hover:bg-gray-100">logout</div>
          <div className="border border-gray-200 p-2 px-3 rounded-md bg-gray-50 items-center flex cursor-pointer hover:border-gray-300 hover:bg-gray-100"
            onClick={setIsToggled}
          ><RiArchiveDrawerLine/></div>
        </div>
        <div className="font-bold border border-gray-200 p-2 px-3 rounded-md bg-gray-50 items-center flex cursor-pointer hover:border-gray-300 hover:bg-gray-100">
          <Link to={'/'}>SUPERFILE</Link>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNav
