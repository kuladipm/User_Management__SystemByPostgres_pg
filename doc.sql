--schema created
CREATE SCHEMA userschema;
SHOW search_path
--search path set to creatd schema
SET search_path TO userschema,public;
--for delete column type is created
create type isDel as enum('0','1');
--users main table created
create table userschema.users (user_id int GENERATED ALWAYS AS IDENTITY primary key ,
  first_name varchar(30) not null,
  last_name varchar(30) not null,
  date_of_birth date not null,
  gender varchar(9) check (gender in('Male','Female','Other')),
  email varchar(50) not null unique,
  password varchar(50) not null ,
  del isDel Default '0',);
--address table created
create table userschema.address(address_id int GENERATED ALWAYS AS IDENTITY primary key, apartment_name varchar(50) not null,
  street varchar(50) not null,
  landmark varchar(50) not null,
  pin_code smallint not null ,
city varchar(50) not null,
 del isDel Default '0',
 user_id int,
constraint user_id foreign key(user_id) references userschema.users(user_id),
);
--state table created
 create table userschema.states (state_id int GENERATED ALWAYS AS IDENTITY primary key,user_id int ,state_name varchar(50) not null,constraint user_id foreign key(user_id) references userschema.users(user_id));
--select query for getting data from all table using join
select users.first_name,users.last_name,users.date_of_birth,users.gender,users.email,users.password,address.apartment_name,address.street,address.landmark,address.pin_code,address.city, states.state_name from userschema.users inner join userschema.address on users.user_id=address.user_id inner join userschema.states on users.user_id=states.user_id;
--here we alter pin code column data type
 alter table userschema.address alter column pin_code type int;
--trigger created
 CREATE TRIGGER users_first_email_password_changes
  BEFORE UPDATE
  ON userschema.users
  FOR EACH ROW
  EXECUTE PROCEDURE log_users_first_email_password_changes();
--user audit table created
   create table userschema.users_audit (user_id int not null,email varchar(50) not null);
--trigger function
  create or replace function log_users_first_email_password_changes() RETURNS TRIGGER Language PLPGSQL as $$ begin if new.email <> old.email then insert into userschema.users_audit (user_id,email,changed_on) values (old.user_id,old.email,now()); end if; return new; end; $$;

select users.user_id,users.first_name,users.last_name,users.email,address.city, states.state_name from userschema.users inner join userschema.address on users.user_id=address.user_id inner join userschema.states on users.user_id=states.user_id
--create view 
CREATE view userView as select users.user_id,users.first_name,users.last_name,users.email,address.city, states.state_name from userschema.users inner join userschema.address on users.user_id=address.user_id inner join userschema.states on users.user_id=states.user_id order by users.user_id;
--select data from view
select * from userschema.userview;
--password column alter bcz now we stored hash password
alter table userschema.users alter column password type varchar (72)
--check password form id
 select password from userschema.users where user_id='1' and del='0'
 --insert data in users table
 insert into userschema.users (first_name, last_name,date_of_birth, gender, email, password) values ('tech','indxtech','2002-07-05','Other','indtech1414@indx.ai','Indx123@') RETURNING user_id
 --insert data in address table
 INSERT INTO userschema.address(apartment_name,street,landmark,pin_code,city,del,user_id) VALUES ('vrandawan','gdb street','khau galli','121212','pune','0','1') RETURNING user_id 
 --insert data in states
 INSERT INTO userschema.states(user_id,state_name) VALUES ('1','Maharashtra')
 --count no of record in db
 select count(*) from userschema.users where del='0'
 --pagination query
 select users.user_id,users.first_name,users.last_name,users.date_of_birth,users.gender,users.email,address.apartment_name,address.street,address.landmark,address.pin_code,address.city, states.state_name from userschema.users inner join userschema.address on users.user_id=address.user_id inner join userschema.states on users.user_id=states.user_id where users.del=$1 order by user_id desc limit 5 offset ((1 - 1) * 5)
--search record in db based on email
 select users.user_id,users.first_name,users.last_name,users.date_of_birth,users.gender,users.email,users.password,address.apartment_name,address.street,address.landmark,address.pin_code,address.city, states.state_name from userschema.users inner join userschema.address on users.user_id=address.user_id inner join userschema.states on users.user_id=states.user_id where email like '%sb%' and users.del='0' 
--update user table without password update
 update userschema.users set first_name='magar', last_name='kk',date_of_birth='2002-02-12', gender='Male', email='indtech1414@indx.ai' where user_id='1'
--update address table with password update
 update userschema.users set first_name='magar', last_name='kk',date_of_birth='2002-02-12', gender='Male', email='indtech1414@indx.ai',password='indtech1414@121' where user_id='1'
--update address table
 update userschema.address set apartment_name='gokuldham',street='sb road',landmark='khau galli',pin_code='313131',city='Pune' where user_id='1'
--update states table
 update userschema.states set state_name='Maharashtra' where user_id='1'
--delet rows from users table here we did soft delete so that we uses update method 
update userschema.users set del='1' where user_id='1'
-- delete from address table
update userschema.address set del='1' where user_id='1'
-- delete from states table
update userschema.states set del='1' where user_id='1'


