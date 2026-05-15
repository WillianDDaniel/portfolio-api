export default function WelcomePanel() {
  return (
    <div className="hidden md:flex md:w-1/2 bg-blue-900 
      text-white flex-col justify-center items-center p-12"
    >
      <div className="max-w-md text-center">

        <h1 className="text-4xl font-bold mb-4">
          Bem-vindo
        </h1>

        <p className="text-lg text-blue-200">
          Login do painel de admin do portfólio do Willian.
        </p>
      </div>
    </div>
  )
};
