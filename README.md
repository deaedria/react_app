# chatify-server

user endpoint

    GET      /users
    GET      /users/get_user?id=1
    POST     /users
    POST     /users/search_user?name=a
    PATCH    /users/1
    DEL      /users/1

contact endpoint

    GET      /contacts
    GET      /contacts/1
    POST     /contacts
    POST     /contacts/search_contact?name=a
   
user's contact list endpoint

    GET      /contactlist/user_id?id=1
    POST     /contactlist/user_id?id=1
    PATCH    /contactlist/1
    DEL      /contactlist/1

authentication

    POST     /users/login
    POST     /users/register

when put under a domain with `PREFIX_URI`, it would look like:

    https://www.example.com/api/v1/users

Paginate

    POST     /users?limit=4&page=2
