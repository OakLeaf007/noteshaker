
const toggle = document.getElementById("toggle");

toggle.addEventListener("change" , function() {
let passwd = document.getElementById("pass");

if (this.checked){
    passwd.type = "text";

}
else{
    passwd.type = "password";
}

});