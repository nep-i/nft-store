import { BaseApiRepository } from "./baseApi.repository";
import { BaseApolloRepository } from "./baseApollo.repository";

export class BaseSwitcher {
  static isApolloRepository: boolean = true;

  setBase: any = (isApollo: boolean) => {
    BaseSwitcher.isApolloRepository = isApollo;
  };

  static dynamicBase: typeof BaseApiRepository | typeof BaseApolloRepository =
    BaseSwitcher.isApolloRepository ? BaseApolloRepository : BaseApiRepository;
}
