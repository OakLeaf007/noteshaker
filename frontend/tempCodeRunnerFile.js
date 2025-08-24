function handleCredentialResponse(response){
  fetch(`${API}/gpggle-login`,{
    method:"POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({token:response.credential})
  })
  .then(res =>res.json())
  .then(data =>{
    if(data.user) document.getElementById("user").innerText ="hello" + data.user.name;
  });
}