// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
const assets: string = 'assets/images/';

export const environment = {
  production: false,
  url: "http://localhost:8083/mmcs",
  img_logo: assets + 'proaktiv-logo.png',
  // img_solution_mobile: assets + 'mobileweb.jpg',
  // img_solution_cloud: assets + 'cloud.jpg',
  // img_solution_planning: assets + 'planning.jpg',
  // img_solution_coding: assets + 'coding.jpg',
  // img_solution_integration: assets + 'integration.jpg',
  // img_solution_onphone: assets + 'onphone.jpg',
  img_product_dashboard: assets + 'dashboard.png',
  // img_contactus_senteulocation: assets + 'senteulocation.jpg',
  img_user: assets + 'userPic.jpg',
  
  img_at: assets + 'at_logo.png',
  img_aws: assets + 'aws_logo.jpg',
  img_do: assets + 'do_logo.jpg',
  img_ms: assets + 'ms_logo.jpg',
  img_saf: assets + 'saf_logo.jpg'
};
