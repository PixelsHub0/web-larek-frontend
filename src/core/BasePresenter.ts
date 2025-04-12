abstract class BasePresenter {
  protected model: BaseModel<any>;
  protected view: BaseView;

  abstract initialize(): Promise<void>;
}