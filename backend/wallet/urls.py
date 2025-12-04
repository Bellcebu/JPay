# app/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UsuarioViewSet,
    SolicitudPrestamoViewSet,
    SesionViewSet,
    PrestamoViewSet,
    CuotaViewSet,
    PagoViewSet,
    CuentaViewSet,
    CuentaVinculadaViewSet,
    MovimientoViewSet,
    MovimientoListView,
    MovimientoListView,
    SimuladorPrestamoView,
    LoginView,
    LogoutView,
    SignUpView,
    GenerarQRView,
    ParsearQRView,
    PagarQRView,
    TransferenciaView,
    KYCUploadDNIView,
    LookupCuentaView,
    NotificacionListView,
    NotificacionReadView,
    ComprobanteDownloadView,
    UsuarioMeView,
    ContactosView,
    SuggestedContactsView,
)

router = DefaultRouter()
router.register(r'usuarios', UsuarioViewSet, basename='usuario')
router.register(r'solicitudes', SolicitudPrestamoViewSet, basename='solicitud')
router.register(r'sesiones', SesionViewSet, basename='sesion')
router.register(r'prestamos', PrestamoViewSet, basename='prestamo')
router.register(r'cuotas', CuotaViewSet, basename='cuota')
router.register(r'pagos', PagoViewSet, basename='pago')
router.register(r'cuentas', CuentaViewSet, basename='cuenta')
router.register(r'cuentas-vinculadas', CuentaVinculadaViewSet, basename='cuenta-vinculada')


urlpatterns = [
    path('', include(router.urls)),
    path("simulador-prestamo/", SimuladorPrestamoView.as_view(), name="simulador-prestamo"),
    path("auth/login/", LoginView.as_view(), name="api-login"),
    path("auth/logout/", LogoutView.as_view(), name="api-logout"),
    path("auth/signup/", SignUpView.as_view(), name="api-signup"),
    path("qr/generar/", GenerarQRView.as_view(), name="qr-generar"),
    path("qr/parsear/", ParsearQRView.as_view(), name="qr-parsear"),
    path("qr/pagar/", PagarQRView.as_view(), name="qr-pagar"),
    path("transferir/lookup/", LookupCuentaView.as_view()),
    path("transferencias/", TransferenciaView.as_view(), name="transferencias"),
    path("movimientos/", MovimientoListView.as_view()),
    path("auth/kyc/dni/", KYCUploadDNIView.as_view(), name="kyc-dni-upload"),
    path("notificaciones/", NotificacionListView.as_view()),
    path("notificaciones/<int:pk>/leer/", NotificacionReadView.as_view()),
    path("comprobantes/<str:referencia>/", ComprobanteDownloadView.as_view()),
    path("usuario/me/", UsuarioMeView.as_view()),
    path("contactos/", ContactosView.as_view(), name="contactos"),
    path("contactos/sugeridos/", SuggestedContactsView.as_view(), name="contactos-sugeridos"),
    path("", include(router.urls)),
]
