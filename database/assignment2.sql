--Insert Account for Tony Stark
INSERT INTO public.account (
account_firstname, account_lastname, account_email, account_password, account_type) VALUES (
'Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n', 'Admin')
 returning account_id;

--Delete Tony Stark's Account
DELETE FROM public.account
    WHERE account_id IN
        (1);

-- or use this if not first one
--DELETE FROM public.account
--    WHERE account_email IN
--        ('tony@starkent.com');

--update Hummer
UPDATE public.inventory SET
inv_description = REPLACE(inv_description,'small interiors','a huge interior') WHERE
inv_id = 10;

--get Sport Cars
SELECT
    inv_make,
    inv_model,
	classification_name
FROM
    inventory
INNER JOIN classification
    ON inventory.classification_id = classification.classification_id
	AND classification_name = 'Sport';

--update img & thumbnail URL
UPDATE public.inventory 
SET
inv_image = REPLACE(inv_image,'images/','images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail,'images/','images/vehicles/');

