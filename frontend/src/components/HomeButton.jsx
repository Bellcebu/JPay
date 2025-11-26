const HomeButton = ({ children, className = "", ...props}) => {
    const base = "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition w-full";
    return (
        <button type="button" className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
};
export default HomeButton;