import SidebarContent from "../SidebarContent";

function QuizzSidebar({ questions ,type}) {
  return <SidebarContent questionsData={{ questions }} type={type} />;
}

export default QuizzSidebar;