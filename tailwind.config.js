import fluid, {extract, screens, fontSize} from "fluid-tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: {
    files: ["./*.html",
     "./src/js/**/*.js",
     "./src/css/**/*.css"
    ],
    extract
  },
  theme: {
    fontSize,
    extend: {
      screens: {
        ...screens,
      },
      fontFamily: {
        kumbhsans: ["Kumbh Sans", "sans-serif"]
      },
      colors: {
        "orange": "var(--orange)",
        "pale-orange": "var(--pale-orange)",
        "very-dark-blue": "var(--very-dark-blue)",
        "dark-grayish-blue": "var(--dark-grayish-blue)",
        "grayish-blue": "var(--grayish-blue)",
        "light-grayish-blue": "var(--light-grayish-blue)",
        "white": "var(--white)",
        "black": "var(--black)"
      }
    },
  },
  plugins: [
    fluid()
  ],
}

