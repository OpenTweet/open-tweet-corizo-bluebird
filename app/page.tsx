import LeftSideBar from '@/components/layout/LeftSidebar';
import MainComponent from '@/components/layout/MainComponent';
import RightSection from '@/components/layout/RightSection';


export default function Home() {
  return (
    <div className="container w-full h-full flex justify-center items-center relative">
      <div className="max-w-screen-lg laptop:max-w-screen-xl w-full h-full flex flex-row justify-center relative">
        <LeftSideBar />
        <MainComponent />
        <RightSection /> 
      </div>
    </div>
  );
}
