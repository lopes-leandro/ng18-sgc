import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter, Routes } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';

describe('AppComponent', () => {

  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerHarness: RouterTestingHarness;

  // Componente fictício para a rota
  @Component({
    standalone: true,
    template: '<div class="dummy-content">Conteúdo da Página Inicial</div>'
  })
  class DummyComponentTest {}

  const routes: Routes = [
    {
      path: '', component: DummyComponentTest, title: 'Página Inicial'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter(routes)
      ]
    }).compileComponents();


    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Inicializando o RouterTestingHarness
    routerHarness = await RouterTestingHarness.create();

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('Layout Structure', () => {
    it('should render header with correct title', () => {
      
      //Given: o cabeçalho da aplicação
      const headerElement = fixture.debugElement.query(By.css('.app-header'));

      // When: buscamos o elemento de título
      const titleElement = headerElement.query(By.css('h1'));

      //Then: deve conter o título esperado
      expect(headerElement).toBeTruthy();
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent).toBe('Sistema de Gestão de Contratos');
    });

    it('should render main content are with router-outlet', () => {

      //Given: a área de conteúdo principal
      const mainElement = fixture.debugElement.query(By.css('.app-content'));

      //When: buscamos o elemento router-outlet
      const routerOutletElement = mainElement.query(By.css('router-outlet'));

      // Then: o router-outlet deve estar presente.
      expect(mainElement).toBeTruthy();
      expect(routerOutletElement).toBeTruthy();
    });

    it('should render footer with copyright information', () => {
      // Given: o rodapé da aplicação
      const footerElement = fixture.debugElement.query(By.css('.app-footer'));

      //When: buscamos o conteúdo do rodapé
      const footerContent = footerElement.query(By.css('.footer-content p'));

      // Then: deve conter as informações de copyright esperadas
      expect(footerElement).toBeTruthy();
      expect(footerContent).toBeTruthy();
      expect(footerContent.nativeElement.textContent).toContain('©');
      expect(footerContent.nativeElement.textContent).toContain('Sistema de Gestão de Contratos');
      expect(footerContent.nativeElement.textContent).toContain('© 2025 - Sistema de Gestão de Contratos');

    });

  });

  describe('Styling', () => {
    it('should have app container with correct class', () => {
      // Given: o container principal
      const appContainer = fixture.debugElement.query(By.css('.app-container'));

      // Then: deve ter as propriedades de layout flexível esperadas
      expect(appContainer).toBeTruthy();

      // Then Alternativo: verificar classes ou atributos em vez de estilos computados
      expect(appContainer.nativeElement.className).toBe('app-container');        
    });

    it('should have header with correct class', () => {
      // Given: o elemento do cabeçalho
      const headerElement = fixture.debugElement.query(By.css('.app-header'));

      // Then: deve ter as classes apropriadas para a cor corporativa
      expect(headerElement).toBeTruthy();
      expect(headerElement.nativeElement.className).toBe('app-header');
    });

    it('should have app content with correct class', () => {
      // Given
      const mainElement = fixture.debugElement.query(By.css('.app-content'));

      // Then
      expect(mainElement).toBeTruthy();
      expect(mainElement.nativeElement.className).toBe('app-content');
    });

    it('should have app footer with correct class', () => {
      // Given
      const footerContent = fixture.debugElement.query(By.css('.app-footer'));

      // Then
      expect(footerContent).toBeTruthy();
      expect(footerContent.nativeElement.className).toBe('app-footer');
    });

    it('should have footer content with correct class', () => {
      // Given
      const footerContent = fixture.debugElement.query(By.css('.footer-content'));

      // Then
      expect(footerContent).toBeTruthy();
      expect(footerContent.nativeElement.className).toBe('footer-content');
    });
    
    it('should have header content with correct class', () => {
      // Given
      const headerContent = fixture.debugElement.query(By.css('.header-content'));

      // Then
      expect(headerContent).toBeTruthy();
      expect(headerContent.nativeElement.className).toBe('header-content');
    });
  });

  describe('Routing', () => {
    it('should nagivate to the default route', fakeAsync(async () => {

      // Given: Navega para a rota raiz
      await routerHarness.navigateByUrl('/');
      // permite que a navegação seja concluída
      tick();

      // When: obtemos o componente renderizado
      const renderedComponent = fixture.debugElement.query(By.css('.dummy-content'));

      // Then: Verifica se o component foi carregado no DOM
      expect(renderedComponent).toBeTruthy();

      // Se o renderedComponent é encontrado, validamos seu conteúdo.
      if (renderedComponent) {
        expect(renderedComponent.nativeElement.textContent).toBe('Conteúdo da Página Inicial');        
      }
    }));
  });

});
