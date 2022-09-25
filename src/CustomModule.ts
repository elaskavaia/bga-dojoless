/**
 * Custom module
 */
class CustomModule {
  gamedatas: any;
  setup(gamedatas: any){
     this.gamedatas = gamedatas;
     console.log("hello from setup of MyFoo");
  }
};