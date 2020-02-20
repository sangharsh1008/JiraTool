if [ -d "./node_modules" ] 
then
 npm run start & npm run electron
else
echo 'please wait packages are installing ...'
   npm i 
   npm run start & npm run electron
fi

read