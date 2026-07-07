//C:\Users\Mikel\PycharmProjects\TypeScriptPlaywrightAuto\workflows\login-workflow.ts
import { SignupPage } from '../pages/signup-page';
import { TestUser } from '../test_utils/test-data-factory';

export class LoginWorkflow
{
    static async login(
        signupPage: SignupPage,
        user: TestUser
    ): Promise<void>
    {
        await signupPage.navigateToLogin();

        await signupPage.login(
            user.email,
            user.password
        );

        await signupPage.assertLoggedIn(
            user.fullName
        );
    }
}