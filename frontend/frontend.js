const form = document.getElementById("signup-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("mail").value;
  const name = document.getElementById("usr").value;
  const password = document.getElementById("pass").value;

    try{
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password }),
  });
  

  const data = await res.json();

  if(res.ok){
   
     document.getElementById("message").textContent =  data.message || data.error;
    window.location.href="/signin.html";
  }else{
    document.getElementById("message").textContent =  data.message || data.error;
  }

    }
    catch(err){
  alert(" Something went wrong");
    }
});

