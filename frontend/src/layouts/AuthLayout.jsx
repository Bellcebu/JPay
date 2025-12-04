const AuthLayout = ({ children }) => {
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-gradient-to-b from-[#faf5ff] to-white px-4 py-12">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-[#9333ea] text-4xl font-bold tracking-wider mb-4">JPAY</h1>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
