const colors = require("tailwindcss/colors");
// arda abi ben bi config ayarladım da jsconfig diye bu config import ederken kullanılıyor
// import'u daha rahat ve kolay yapıyor ../../../ gibi karın ağrılarına yazmana gerek kalmıyor

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
	scale: {
		"102": "1.02"
	},
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      orange: colors.orange,
      white: colors.white,
      gray: colors.coolGray,
      red: colors.red,
      yellow: colors.amber,
      blue: colors.blue,
      teal: colors.teal,
      green: colors.green
    }
  },
  variants: {
    extend: {
		borderWidth: ["hover"],
		ringWidth: ["hover"],
	},
  },
  plugins: [],
}
