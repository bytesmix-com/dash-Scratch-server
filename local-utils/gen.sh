MKCERT_PATH=$(which mkcert)
if [ -z "$MKCERT_PATH" ]
then  
  brew install mkcert
fi

security unlock-keychain login.keychain
mkcert -install     
mkcert -key-file ./key.pem -cert-file ./cert.pem "api-local.stg-branch.be"