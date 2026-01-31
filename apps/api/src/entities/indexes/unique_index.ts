export const UniqueIndex = {
    User: {
        email: {
            key: 'unique_user_email_index',
            error: 'Já existe user com o mesmo email'
        }
    },
    Meeting: {
        name: {
            key: 'unique_meeting_name_index',
            error: 'Já existe meenting com o mesmo nome'
        }
    },
};
