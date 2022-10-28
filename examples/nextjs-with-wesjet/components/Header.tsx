import Link from 'next/link'

function Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" fill="currentColor" viewBox="0 0 16 16" id="IconChangeColor"> <path d="M9.05.435c-.58-.58-1.52-.58-2.1 0L4.047 3.339 8 7.293l3.954-3.954L9.049.435zm3.61 3.611L8.708 8l3.954 3.954 2.904-2.905c.58-.58.58-1.519 0-2.098l-2.904-2.905zm-.706 8.614L8 8.708l-3.954 3.954 2.905 2.904c.58.58 1.519.58 2.098 0l2.905-2.904zm-8.614-.706L7.292 8 3.339 4.046.435 6.951c-.58.58-.58 1.519 0 2.098l2.904 2.905z" id="mainIconPathAttribute" strokeWidth="1" stroke="#0b1bf4" fill="#ff006a"></path> </svg>
  )
}

function Logo() {
  return (
    <Link href="/">
      <a className="inline-flex justify-center items-center">
        <span className="mr-2">
          <Icon />
        </span>
        <span className="font-bold">WESJET</span>
      </a>
    </Link>
  )
}

export function Header() {
  return (
    <header className="p-8 flex justify-center">
      <Logo />
    </header>
  )
}
