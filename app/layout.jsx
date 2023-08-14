import "../style/faucetCss.css"




export const metadata ={
  title: "Bsc testnet faucet(BNB)",
  description: "A simple bsc-testnet faucet utilized to test your own project", 
}



const Layout = ({children}) => {
  return (
   


   
   <html lang = "en">
<body className = "bodi">

<div className = "main">
    </div>

<main className = "app">
{children}

</main>

</body>


   </html>
  
  )
}

export default Layout