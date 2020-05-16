function nginxTemplate(username, port) {
  let conf = `server {
  server_name ${username}.launchsite.tech;

   listen 443 ssl http2;
   ssl_certificate /etc/letsencrypt/live/launchsite.tech/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/launchsite.tech/privkey.pem;
   include /etc/letsencrypt/options-ssl-nginx.conf;
   ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;


 location / {
   proxy_pass http://localhost:${port};
   proxy_http_version 1.1;
   proxy_set_header Upgrade $http_upgrade;
   proxy_set_header Connection 'upgrade';
   proxy_set_header Host $host;
   proxy_cache_bypass $http_upgrade;
 }
}


server {
   if ($host = ${username}.launchsite.tech) {
       return 301 https://$host$request_uri;
   }

  listen 80;
  server_name ${username}.launchsite.tech;
   return 404;
}`
  return conf
}

exports.default = nginxTemplate
