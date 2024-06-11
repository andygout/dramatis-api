import { shutDown } from '../src/app';

export async function mochaGlobalTeardown () {

	shutDown();

}
