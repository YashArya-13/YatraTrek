"""
Management command: seed_users
Run with:  python manage.py seed_users

Creates (or resets passwords for) the default CRM users:
  admin   / admin123   (role: admin,   superuser)
  manager / manager123 (role: manager)
  sales   / sales123   (role: sales)
"""

from django.core.management.base import BaseCommand
from users.models import User


DEFAULT_USERS = [
    {
        "username": "admin",
        "password": "admin123",
        "role": "admin",
        "is_staff": True,
        "is_superuser": True,
        "email": "admin@nexcrm.com",
        "first_name": "Admin",
        "last_name": "User",
    },
    {
        "username": "manager",
        "password": "manager123",
        "role": "manager",
        "is_staff": True,
        "is_superuser": False,
        "email": "manager@nexcrm.com",
        "first_name": "Manager",
        "last_name": "User",
    },
    {
        "username": "sales",
        "password": "sales123",
        "role": "sales",
        "is_staff": False,
        "is_superuser": False,
        "email": "sales@nexcrm.com",
        "first_name": "Sales",
        "last_name": "Rep",
    },
]


class Command(BaseCommand):
    help = "Seed default CRM users (admin, manager, sales) with known passwords."

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.MIGRATE_HEADING("\n=== Seeding Default Users ===\n"))

        for data in DEFAULT_USERS:
            username = data["username"]
            password = data["password"]

            user, created = User.objects.get_or_create(username=username)
            user.email = data["email"]
            user.first_name = data["first_name"]
            user.last_name = data["last_name"]
            user.role = data["role"]
            user.is_staff = data["is_staff"]
            user.is_superuser = data["is_superuser"]
            user.is_active = True
            user.set_password(password)  # always reset to ensure password is correct
            user.save()

            status = "CREATED" if created else "UPDATED"
            self.stdout.write(
                self.style.SUCCESS(
                    f"  [{status}]  username={username!r}  password={password!r}  role={data['role']}"
                )
            )

        self.stdout.write(self.style.SUCCESS("\nDone! Login with any of the above credentials.\n"))
