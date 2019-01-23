module.exports.user = function (UserID, FirstName,
                                LastName, EmailAddress, Address1, Address2,
                                City, State, PostalCode, Country) {

    return
    {

            UserID = UserID,
            FirstName = FirstName,
            LastName = LastName,
            EmailAddress = EmailAddress,
            Address1 = Address1,
            Address2 = Address2,
            City = City,
            State = State,
            PostalCode = PostalCode,
            Country = Country
    };
}