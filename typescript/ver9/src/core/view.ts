// TODO VIEW 클래스: 공통 =========================================================================

export default abstract class View {
  private template: string;
  private renderTemplate: string;
  private container: HTMLElement;
  private htmlList: string[];

  constructor(containerId: string, template: string) {
    const containerElement = document.getElementById(containerId);

    // ID가 containerId인 엘리먼트가 존재하지 않는다면 앱을 실행할 수 없으므로 종료시킨다
    if (!containerElement)
      throw "최상위 컨테이너가 존재하지 않으므로 UI 생성에 실패하였습니다.";

    this.container = containerElement;
    this.template = template;
    this.renderTemplate = template;
    this.htmlList = [];
  }

  protected updateView(): void {
    // 기존엔 container가 null인지 아닌지 체크했지만 여기선 생성자에서 이미 했으므로
    this.container.innerHTML = this.renderTemplate;
    this.renderTemplate = this.template;
  }

  protected addHtml(htmlString: string): void {
    this.htmlList.push(htmlString);
  }

  protected getHtml(): string {
    const snapshot = this.htmlList.join("");
    this.clearHtmlList();
    return snapshot;
  }

  protected setTemplateData(key: string, value: string): void {
    this.renderTemplate = this.renderTemplate.replace(`{{__${key}__}}`, value);
  }

  private clearHtmlList(): void {
    this.htmlList = [];
  }

  abstract render(): void;
  // 반드시 이런 규격의 메소드를 자식 메소드가 구현하도록 강제하는 타입스크립트 문법으로,
  // 이 문법을 구사하고자 하는 클래스는 class 키워드 앞에 abstract를 붙여주어야함.
}
