export const fullName = (member) => {
  if (!member.lastname) {
    return member.firstname.toUpperCase();
  } else {
    return `${member.firstname} ${member.lastname}`.toUpperCase();
  }
};

export const getInitials = (member) => {
  if (!member.lastname) {
    return `${member.firstname[0]}`.toUpperCase();
  } else {
    return `${member.firstname[0]}${member.lastname[0]}}`.toUpperCase();
  }
};
