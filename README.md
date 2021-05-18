# iCarte-iParte

## User stories
- Ca dezvoltator, doresc sa stochez date despre utilizatori in urmatoarele tabele:
  - USERS (email, ....)
	- ....
	- ....
	- (restul de tabele) -> completati voi

- Ca dezvoltator, doresc sa implementez baza de date in cloud (folosind elephant sql)

- Ca dezvoltator, doresc sa am o structura de baza a serverului implementata. Aceasta va contine: end-point-urile API-ului care va intoarce informatii de la baza de date,
un config file pentru conectivitatea la baza de date, diverse fisiere javascript de utilitati (validare de input, etc)

- Ca utilizator, doresc sa am o interfata grafica de baza. Aceasta va continte: 
	- o bara de navigare fixa in partea superioara a ecranului. Bara de navigare va contine un search bar,un buton catre pagina principala si un buton catre profilul utilizatorului.
	- lista utilizatorilor pe care utilizatorul logat ii urmareste (fixata in partea dreapta a ecranului)
	- o sectiune de sugestii de carti,grupuri,utilizatori (fixata in partea stanga a ecranului)
	- o sectiune principala care va contine fie feed-ul utilizatorului, fie o pagina specifica accesata de acesta (un alt profil, o carte sau un un grup)

- Ca utilizator, doresc sa pot scrie titlul unei carti in search bar, iar la apasarea tastei enter sa mi se afiseze o lista de rezultate care se potrivesc titlului introdus. Mai apoi, doresc sa pot da click pe oricare dintre titlurile obtinute si sa accesez pagina specifica a acelui titlu. 

- Ca utilizator, doresc sa vizualizez pe o pagina specifica a unui titlu informatii despre acesta (autori, imagine, data publicarii) si recenziile acelui titlu

- Ca utilizator doresc sa pot da o recenzie unui titlu dand click pe un buton ce reprezinta un numar de stele (de la 1 la 5) si scriind intr-o casuta de text un mesaj corespunzator

- Ca utilizator, doresc sa pot scrie numele unui utilizator in search bar, iar la apasarea tastei enter sa mi se afiseze o lista de rezultate care se potrivesc cu numele introdus. Mai apoi, doresc sa pot da click pe oricare dintre numele obtinute si sa accesez profilul acelui utilizator.

- Ca utilizator, doresc sa vizualizez pe o pagina specifica de profil a altui utilizator informatii precum: ce carti citeste, username

- Ca utilizator, doresc sa urmaresc alti utilizatori prin apasarea unui buton. Mai apoi, cartile citite de ceilalti utilizatori / recenziile acestora vor aparea in feed

- Ca utilizator, doresc sa pot scrie titlul unui grup in search bar, iar la apasarea tastei enter sa mi se afiseze o lista de rezultate care se potrivesc grupului introdus. Mai apoi, doresc sa pot da click pe oricare dintre grupurile obtinute si sa accesez pagina specifica a acelui grup.

- Ca utilizator, doresc sa vizualizez pe o pagina specifica a unui grup numarul de membrii, descriere, lista membrilor, lista postarilor.

- Ca utilizator (membru intr-un grup) doresc sa pot posta in grupuri (imagini si/sau text).

- Ca utilizator, doresc sa pot adera la un grup prin apasarea unui buton specific. Prin apasarea butonului se emite o cerere care mai apoi va fi acceptata (sau nu) de catre administratorul grupului respectiv.

- Ca utilizator, doresc sa pot crea grupuri prin intermediul unui buton ce va deschide mai apoi un formular care se va completa cu informatiile corespunzatoare.

- Ca utilizator (administrator al unui grup) doresc sa pot sterge postarile inadecvate. 

- Ca utilizator, vreau să pot marca unele cărți în una dintre următoarele categorii: citite, în curs de citire, de citit in urma apasarii unui buton de pe pagina specifica unui titlu.

- Ca dezvoltator, doresc să pot oferi aplicația spre a putea fi folosită de oricine are acces la internet (vom utiliza serviciul de hostare oferit de www.heroku.com)
