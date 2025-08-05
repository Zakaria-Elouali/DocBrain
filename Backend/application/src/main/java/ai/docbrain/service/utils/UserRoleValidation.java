//package ai.docbrain.service.utils;
//
//
//import ai.docbrain.domain.role.Role;
//import ai.docbrain.domain.users.User;
//
//public class UserRoleValidation {
//    public static void validateUserWithCorrectRoleOrThrow(User user, Role expectedRole, String errorMessage) {
//        if (user.getRoles() != expectedRole) throw new ResourceNotFoundException(errorMessage);
//    }
//}
