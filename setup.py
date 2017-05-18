from setuptools import setup
import sys

print sys.platform

setup(
    name='refresh-aws-token',
    version='0.2.1',
    scripts=['refresh-aws-token'],
    install_requires=[
        'boto==2.46.1',
        'requests==2.13.0'
    ] + (
        ['winkerberos==0.6.0'] if
            'win32' in sys.platform or
            'cygwin' in sys.platform
        else
        ['pykerberos==1.1.14']
    )
)
