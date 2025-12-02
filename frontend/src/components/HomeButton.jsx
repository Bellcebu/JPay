const HomeButton = ({ children, className = "", ...props}) => {
    const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-white bg-[#2E2E48] hover:bg-purple-700 transition w-full";
    return (
        <button type="button" className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
};
export default HomeButton;