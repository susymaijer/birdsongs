function redirectIfInNL()
{
u=document.URL;
s=u.toLowerCase();
p=s.indexOf('birdsongs.nl');
if(p!=-1)
  window.location.replace(u.substring(0,p)+'birdsongs.com'+u.substring((p + 13 - 1),1000));
}

