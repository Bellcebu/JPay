const LoginButton = ({ children, ...props }) => {
  return (
    <button
      type="submit"
      className="w-full py-4 px-4 rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 transition duration-200"
      {...props}
    >
      {children}
    </button>
  );
};

export default LoginButton;
