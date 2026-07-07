import { SignupPage } from '../pages/signup-page';
import { AccountPage } from '../pages/account-page';
import { TestUser } from '../test_utils/test-data-factory';


export class RegistrationWorkflow
{

    static async register(
        signupPage: SignupPage,
        accountPage: AccountPage,
        user: TestUser
    ): Promise<void>
    {

        //
        // Start registration
        //

        await signupPage.startSignup(
            user.fullName,
            user.email
        );


        await signupPage.submitSignup();



        //
        // Complete account information
        //

        await accountPage.fillAccountInfo(
        {
            gender: user.gender,
            fullName: user.fullName,
            password: user.password,
            dob: user.dob
        });



        //
        // Complete address information
        //

        await accountPage.fillAddress(
        {
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address
        });



        //
        // Create account
        //

        await accountPage.submitAccountCreation();

    }

}