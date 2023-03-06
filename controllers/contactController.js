const Contact = require("../models/contactModel");

const asyncHandler = require("express-async-handler");
//@desc all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
  //find the contacts by the userid created by
  const Contacts = await Contact.find({ user_id: req.user.id });
  res.status(200).json(Contacts);
});
//@create contact
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async (req, res) => {
  console.log("The request body is :", req.body);
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All fields are mandatory !");
  }
  const contact = await Contact.create({
    name: name,
    email: email,
    phone: phone,
    user_id: req.user.id,
  });
  res.status(200).json(contact);
});

//@desc a contact by its id
//@route GET /api/contacts/:id
//@access private

const getContactById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const contact = await Contact.findById(id);
  res.status(200).json(contact);
});

//@ desc update  contact by id
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  const contact = await Contact.findById(req.params.id);
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user not authorized");
  }
  const updatedcontact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );

  res.status(200).json(updatedcontact);
});

//@desc delete contact by id
//@route DELETE /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (req, res) => {
  const deletedContact = await Contact.findByIdAndDelete(req.params.id);
  if (contact.user_id.toString() !== req.user.id) {
    res.status(403);
    throw new Error("user not authorized");
  }
  // const contact = await Contact.findById(req.params.id);
  // await Contact.remove();
  res.status(200).json(deletedContact);
});

module.exports = {
  getContacts,
  createContact,
  getContactById,
  updateContact,
  deleteContact,
};
