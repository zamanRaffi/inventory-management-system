import Link from 'next/link';


const Header = () => {

  // const handleSubmit = (data) => {
  //   console.log('Form Data:', data);
  //   // Here you can handle adding or updating the product in your state or API
  // };

  return (
    <>
      <header className="body-font mb-5">
  <div className="container mx-auto flex items-center justify-center px-8 py-5 md:flex-row">
    <Link
      href=""
      className="flex items-center justify-center title-font text-6xl text-gray-900 mb-4 md:mb-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
      </svg>
      <h1 className="ml-3 text-4xl font-bold text-white">
        Inventory <span className='text-custom'>Management</span> System
      </h1>
    </Link>
  </div>
</header>

    </>
  );
}

export default Header;
